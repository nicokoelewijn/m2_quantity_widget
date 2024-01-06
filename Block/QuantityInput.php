<?php

namespace Nkdev\QuantityWidget\Block;

class QuantityInput extends \Magento\Framework\View\Element\Template
{
    protected $value;
    protected $_parentBlock;

    public function setItem($item)
    {
        $this->value = $item;
        return $this;
    }

    public function getItem()
    {
        return $this->value;
    }

    public function setParentBlock($block)
    {
        $this->_parentBlock = $block;
        return $this;
    }

    public function getParentBlock()
    {
        return $this->_parentBlock;
    }
}
