<?php

use Phinx\Seed\AbstractSeed;

class CreateAdmin extends AbstractSeed
{
    /**
     * Run Method.
     *
     * Write your database seeder using this method.
     *
     * More information on writing seeders is available here:
     * http://docs.phinx.org/en/latest/seeding.html
     */
    public function run()
    {
      $this->query(" INSERT INTO `administrators` (`id`, `name`, `email`, `password`, `active`, `created`, `updated`) VALUES
(1, 'Òscar Marí', 'oscar@uombo.com', '623ffd0c63acc463419c808e3e588785a86c5a8d92c6a557b4d9972f41fec4d1', 1, '2016-11-10 19:04:28', '2016-11-10 19:09:05');");

    }
}
