# HW3 - RabbitMQ

## Requirements

- Step 1: Install rabbitmq

- Step 2: Create a direct exchange called “hw3”

- Step 3: Create a REST service

- /listen { keys: [array] }

- Creates an exclusive queue, binds to “hw3” with all provided keys, waits to receive a message and returns it as { msg: }

- Step 4: Create a REST service

- /speak { key:, msg: }

- Publishes the message to exchange hw3 with provided key
