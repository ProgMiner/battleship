# marskoy boy

Battleship game

## Requirements
- MySQL
- Java 8+
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
