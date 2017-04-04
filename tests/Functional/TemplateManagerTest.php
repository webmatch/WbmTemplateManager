<?php

class TemplateManagerTests extends Enlight_Components_Test_Controller_TestCase
{
    public function setUp()
    {
        parent::setUp();
        $this->dispatch('/');
    }

    public function testDummy()
    {
        $this->assertTrue(1 === 1);
    }
}