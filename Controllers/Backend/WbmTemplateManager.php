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
        $name = $this->Request()->getParam('name', null);

        $fileInfos = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($templateRoot)
        );

        $data = [];

        foreach($fileInfos as $pathName => $fileInfo) {
            if (!$fileInfo->isFile()) {
                continue;
            }
            if (substr(basename($pathName), 0, 1) === '.') {
                continue;
            }

            $content = '';
            if (!empty($name)) {
                $content = file_get_contents($templateRoot . $name);
            }

            $data[] = [
                'name' => $name ? : str_replace($templateRoot, '', $pathName),
                'content' => $content
            ];
        }

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

