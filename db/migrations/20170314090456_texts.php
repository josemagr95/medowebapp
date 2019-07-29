<?php

use Phinx\Migration\AbstractMigration;

class Texts extends AbstractMigration
{
    /**
     * Change Method.
     *
     * Write your reversible migrations using this method.
     *
     * More information on writing migrations is available here:
     * http://docs.phinx.org/en/latest/migrations.html#the-abstractmigration-class
     *
     * The following commands can be used in this method and Phinx will
     * automatically reverse them when rolling back:
     *
     *    createTable
     *    renameTable
     *    addColumn
     *    renameColumn
     *    addIndex
     *    addForeignKey
     *
     * Remember to call "create()" or "update()" and NOT "save()" when working
     * with the Table class.
     */
    public function change()
    {
      $this->query("
        CREATE TABLE `texts` (
          `id` int(11) NOT NULL AUTO_INCREMENT,
          `key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
          `text_en` text COLLATE utf8mb4_unicode_ci NOT NULL,
          `text_es` text COLLATE utf8mb4_unicode_ci NOT NULL,
          `text_it` text COLLATE utf8mb4_unicode_ci NOT NULL,
          `html` tinyint(1) NOT NULL,      
          `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
           PRIMARY KEY (`id`),
           KEY `key` (`key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");
    }
}
