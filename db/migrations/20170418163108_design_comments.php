<?php

use Phinx\Migration\AbstractMigration;

class DesignComments extends AbstractMigration
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
      $table = $this->table('design_comments');
      $table->addColumn('design_id', 'integer')
            ->addColumn('user_id', 'integer')
            ->addColumn('comment', 'text')
            ->addColumn('created', 'datetime', array('default'=>'CURRENT_TIMESTAMP'))
            ->addColumn('updated', 'datetime', array('null' => true,'update'=>'CURRENT_TIMESTAMP'))
            ->addForeignKey('design_id', 'designs', 'id', array('delete'=> 'CASCADE', 'update'=> 'CASCADE'))
            ->addForeignKey('user_id', 'users', 'id', array('delete'=> 'CASCADE', 'update'=> 'CASCADE'))
            ->create();

    }
}
