<?php

use Phinx\Migration\AbstractMigration;

class Init extends AbstractMigration
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
        CREATE TABLE IF NOT EXISTS `administrators` (
          `id` int(11) NOT NULL,
          `name` varchar(255) NOT NULL,
          `email` varchar(255) NOT NULL,
          `password` varchar(255) NOT NULL,
          `active` tinyint(1) NOT NULL DEFAULT '0',
          `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

        -- --------------------------------------------------------

        --
        -- Table structure for table `administrators_logs`
        --

        CREATE TABLE IF NOT EXISTS `administrators_logs` (
          `id` int(11) NOT NULL,
          `administrator_id` int(11) DEFAULT NULL,
          `administrator_email` varchar(255) NOT NULL,
          `action` varchar(255) NOT NULL,
          `section` varchar(255) NOT NULL,
          `item_id` int(11) DEFAULT NULL,
          `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
          `updated` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

        --
        -- Indexes for dumped tables
        --

        --
        -- Indexes for table `administrators`
        --
        ALTER TABLE `administrators`
          ADD PRIMARY KEY (`id`),
          ADD UNIQUE KEY `email` (`email`),
          ADD KEY `active` (`active`);

        --
        -- Indexes for table `administrators_logs`
        --
        ALTER TABLE `administrators_logs`
          ADD PRIMARY KEY (`id`),
          ADD KEY `administrator_id` (`administrator_id`);

        --
        -- AUTO_INCREMENT for dumped tables
        --

        --
        -- AUTO_INCREMENT for table `administrators`
        --
        ALTER TABLE `administrators`
          MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
        --
        -- AUTO_INCREMENT for table `administrators_logs`
        --
        ALTER TABLE `administrators_logs`
          MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
        --
        -- Constraints for dumped tables
        --

        --
        -- Constraints for table `administrators_logs`
        --
        ALTER TABLE `administrators_logs`
          ADD CONSTRAINT `administrators_logs_ibfk_1` FOREIGN KEY (`administrator_id`) REFERENCES `administrators` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
      ");
    }
}
