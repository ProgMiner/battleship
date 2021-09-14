# marskoy boy
2021 ITMO web-programming course work

## Requirements
- PostgreSQL 13+
- Java 11+
- Maven
- Yarn

## Build

Execute the following command in back-end directory:
```bash
cd front-end
yarn install && yarn build && yarn deploy

cd ../back-end
./mvnw clean package
```

Target application will be in `target/` directory.

## Run

To run application execute following command:
```bash
java -jar path/to/file.jar
