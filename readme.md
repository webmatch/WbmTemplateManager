WbmTemplateManager
=====
[![Scrutinizer](https://scrutinizer-ci.com/g/webmatch/WbmTemplateManager/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/webmatch/WbmTemplateManager/?branch=master)
[![Travis CI](https://travis-ci.org/webmatch/WbmTemplateManager.svg?branch=master)](https://travis-ci.org/webmatch/WbmTemplateManager)

Extend or overwrite templates from out of the [Shopware](https://www.shopware.de) backend.

![WbmTemplateManager](https://www.webmatch.de/wp-content/uploads/2017/04/template_manager.jpg)

The plugin offers the following features:

* Default template structure based on the Bare theme
* Preview syntax of the base templates (Bare)
* Extend base templates or create entirely new templates
* Newly created templates can be found within plugin directory in `/Resources/views/responsive/`

Requirements
-----
* Shopware >= 5.2.0

Installation
====
Clone this repository into a folder **WbmTemplateManager** within the **custom/plugins** directory of the Shopware installation.

* Install the plugin through the Plugin-Manager within the Shopware backend. 
* Activate the plugin and when prompted allow for the clearing of the listed caches.
* Reload the backend to complete the installation.

**Please make sure that the directory `/custom/plugins/WbmTemplateManager/Resources/views/responsive/` has write permissions.**

## Install with composer
* Change to your root Installation of shopware
* Run command `composer require webmatch/wbm-template-manager` and install and activate plugin with Plugin Manager