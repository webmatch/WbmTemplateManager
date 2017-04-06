<?php
/**
 * Template Manager
 * Copyright (c) Webmatch GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

use Shopware\Components\CSRFWhitelistAware;

/**
 * Class Shopware_Controllers_Backend_WbmTemplateManager
 */
class Shopware_Controllers_Backend_WbmTemplateManager extends Shopware_Controllers_Backend_ExtJs implements CSRFWhitelistAware
{

    public function indexAction() 
    {
        $this->View()->loadTemplate("backend/wbm_template_manager/app.js");
    }
    
    public function listAction()
    {
        $templateRoot = $this->container->getParameter('wbm_template_manager.plugin_dir') . '/Resources/views/responsive/';
        $baseTemplateRoot = $this->container->get('application')->DocPath() . 'themes/Frontend/Bare/';
        $name = $this->Request()->getParam('name', null);

        $baseTemplates = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($baseTemplateRoot)
        );

        $customTemplates = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($templateRoot)
        );

        $data = [];

        foreach($baseTemplates as $pathName => $baseTemplate) {
            $namespace = str_replace($baseTemplateRoot, '', $pathName);

            if (
                !$baseTemplate->isFile() ||
                pathinfo($pathName, PATHINFO_EXTENSION) != 'tpl' ||
                (!empty($name) && $name !== $namespace)
            ) {
                continue;
            }

            $data[$namespace] = [
                'name'      => $namespace,
                'content'   => "{extends file='parent:" . $namespace . "'}",
                'oContent'  => file_get_contents($pathName),
                'custom'    => 0
            ];
        }

        foreach($customTemplates as $pathName => $customTemplate) {
            $namespace = str_replace($templateRoot, '', $pathName);

            if (
                !$customTemplate->isFile() ||
                substr(basename($pathName), 0, 1) === '.' ||
                (!empty($name) && $name !== $namespace)
            ) {
                continue;
            }

            $data[$namespace] = [
                'name'      => $namespace,
                'content'   => file_get_contents($pathName),
                'oContent'  => isset($data[$namespace]['oContent']) ? $data[$namespace]['oContent'] : '',
                'custom'    => 1
            ];
        }

        ksort($data);
        $data = array_values($data);

        $this->View()->assign(
            array('success' => true, 'data' => $data)
        );
    }
    
    public function createAction() 
    {
        $this->save();
    }

    public function updateAction() 
    {
        $this->save();
    }

    private function save()
    {
        $templateRoot = $this->container->getParameter('wbm_template_manager.plugin_dir') . '/Resources/views/responsive/';
        $name = ltrim($this->Request()->get('name'), '/');
        $content = $this->Request()->get('content');

        if (!empty($name)) {
            $filePath = $templateRoot . $name;
            $dirname = dirname($filePath);

            if (!is_dir($dirname)) {
                $dirParts = str_replace($templateRoot, '', $dirname);
                $buildPath = rtrim($templateRoot, '/');
                foreach (explode('/', $dirParts) as $dirPart) {
                    $buildPath .= '/' . $dirPart;
                    if (!is_dir($buildPath)) {
                        mkdir($buildPath, 0777, true);
                    }
                }
            }

            $file = fopen($filePath, "w");
            fwrite($file, $content);
            fclose($file);
        }

        $this->View()->assign(
            array(
                'success' => true
            )
        );
    }
    
    public function deleteAction() 
    {
        $templateRoot = $this->container->getParameter('wbm_template_manager.plugin_dir') . '/Resources/views/responsive/';
        $name = $this->Request()->get('name');

        unlink($templateRoot . $name);
        
        $this->View()->assign(
            array('success' => true)
        );
    }

    /**
     * @return array
     */
    public function getWhitelistedCSRFActions()
    {
        return [
            'list',
            'create',
            'update',
            'delete'
        ];
    }
    
}

