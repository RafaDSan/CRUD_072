const { exec } = require("node:child_process");
require("dotenv").config();

// cmd response: mysqld is alive

const { MYSQL_USER, MYSQL_PASSWORD } = process.env;

if (!MYSQL_USER || !MYSQL_PASSWORD) {
  console.error(
    "❌ Error: MYSQL_USER e MYSQL_PASSWORD devem ser inseridos em .env file"
  );
  process.exit(1);
}

function checkMysql() {
  exec(
    `docker exec mysql-dev mysqladmin ping -u ${MYSQL_USER} -p${MYSQL_PASSWORD}`,
    (error, stdout) => {
      if (error) {
        console.error("MySQL ainda não está pronto:", error.message);
        return;
      }

      console.log(stdout);
    }
  );
}

function checkMysql() {
  exec(
    `docker exec mysql-dev mysqladmin ping -u ${MYSQL_USER} -p${MYSQL_PASSWORD}`,
    (error, stdout, stderr) => {
      if (stdout.search("mysqld is alive") === -1) {
        process.stdout.write(".");
        checkMysql();
        return;
      }

      console.log("\n✅ MySQL está pronto e aceitando conexões!");
    }
  );
}

process.stdout.write("\n\n🛑 Aguardando MySQL aceitar conexões");
checkMysql();
