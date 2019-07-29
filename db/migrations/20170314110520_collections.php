<?php

use Phinx\Migration\AbstractMigration;

class Collections extends AbstractMigration
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
      $table = $this->table('collections');
      $table->addColumn('order', 'integer')
            ->addColumn('slug', 'string', array('limit' => 255))
            ->addColumn('name_en', 'string', array('limit' => 255))
            ->addColumn('name_es', 'string', array('limit' => 255))
            ->addColumn('name_it', 'string', array('limit' => 255))
            ->addColumn('description_en', 'text')
            ->addColumn('description_es', 'text')
            ->addColumn('description_it', 'text')
            ->addColumn('shapediver_id', 'string', array('limit' => 255))
            ->addColumn('image', 'string', array('limit' => 255))
            ->addColumn('active', 'boolean', array('default'=>false))
            ->addColumn('created', 'datetime', array('default'=>'CURRENT_TIMESTAMP'))
            ->addColumn('updated', 'datetime', array('null' => true,'update'=>'CURRENT_TIMESTAMP'))
            ->addIndex(array('slug'))
            ->addIndex(array('active'))
            ->addIndex(array('order'))
            ->create();
      
      $this->query("
        CREATE TABLE `collections_images` (
          `id` int(11) NOT NULL,
          `order` int(11) NOT NULL,
          `file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          `text_en` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          `text_es` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          `text_it` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
          PRIMARY KEY (`id`,`order`),
          INDEX (`id`)
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
      
     
      $table = $this->table('collections_images');
      $table->addForeignKey('id', 'collections', 'id', array('delete'=> 'CASCADE', 'update'=> 'CASCADE'))
            ->save();
    }
}
