<?php

namespace Nkdev\QuantityWidget\Block;

use Magento\Framework\View\Element\Template;

class ProductQuantityInput extends Template
{
    /**
     * @var $_parentBlock \Magento\Catalog\Block\Product\View
     */
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
}
