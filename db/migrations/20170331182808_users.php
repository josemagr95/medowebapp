<?php

use Phinx\Migration\AbstractMigration;

class Users extends AbstractMigration
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
      $table = $this->table('users');
      $table->addColumn('name', 'string', array('limit' => 255))
            ->addColumn('email', 'string', array('limit'=>255))
            ->addColumn('password', 'string', array('limit'=>100))
            ->addColumn('image', 'string', array('limit'=>255))
            ->addColumn('verification', 'boolean', array('default'=>false))
            ->addColumn('last_login', 'datetime', array('null' => true))
            ->addColumn('created', 'datetime', array('default'=>'CURRENT_TIMESTAMP'))
            ->addColumn('updated', 'datetime', array('null' => true,'update'=>'CURRENT_TIMESTAMP'))
            ->addIndex(array('active'))
            ->addIndex(array('email'), array('unique' => true))
            ->addIndex(array('password'))
            ->create();

    }
}
