<?php

namespace Nkdev\QuantityWidget\Block;

use Magento\Framework\View\Element\Template;

class CartQuantityInput extends Template
{
    protected $_parentBlock;

    public function setParentBlock($block)
    {
        $this->_parentBlock = $block;
        return $this;
    }

    public function getParentBlock()
    {
        return $this->_parentBlock;
    }

    public function getQuoteId()
    {
        return $this->getData('quote_id');
    }
}
