<?php

use Phinx\Migration\AbstractMigration;

class Textures extends AbstractMigration
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
      $table = $this->table('textures');
      $table->addColumn('shapediver_label', 'string', array('limit' => 255))
            ->addColumn('shapediver_position', 'integer')
            ->addColumn('name_en', 'string', array('limit' => 255))
            ->addColumn('name_es', 'string', array('limit' => 255))
            ->addColumn('name_it', 'string', array('limit' => 255))
            ->addColumn('image', 'string', array('limit' => 255))
            ->addColumn('active', 'boolean', array('default'=>false))
            ->addColumn('created', 'datetime', array('default'=>'CURRENT_TIMESTAMP'))
            ->addColumn('updated', 'datetime', array('null' => true,'update'=>'CURRENT_TIMESTAMP'))
            ->addIndex(array('shapediver_label'))
            ->addIndex(array('shapediver_position'))
            ->create();

    }
}
