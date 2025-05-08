
# Backend Flask para o Sistema Solus

Este é o backend em Flask que fornece APIs para o sistema Solus, usando MySQL como banco de dados.

## Requisitos

- Python 3.8+
- MySQL 5.7+ ou MariaDB 10.3+

## Configuração

1. Crie um banco de dados MySQL:
```sql
CREATE DATABASE solus_db;
```

2. Configure o arquivo `.env` com suas credenciais MySQL:
```
MYSQL_USER=seu_usuario
MYSQL_PASSWORD=sua_senha
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=solus_db
```

3. Instale as dependências:
```
pip install -r requirements.txt
```

4. Execute o servidor:
```
python app.py
```

O servidor será executado em `http://localhost:5000` e criará automaticamente todas as tabelas necessárias.

## APIs disponíveis

### Autenticação
- `POST /api/login` - Autenticar usuário

### Salas
- `GET /api/rooms` - Listar todas as salas
- `GET /api/rooms/<room_id>` - Obter detalhes de uma sala

### Reservas de Salas
- `GET /api/room-reservations` - Listar reservas de salas (filtros opcionais: date, roomId)
- `POST /api/room-reservations` - Criar uma nova reserva de sala

### Carros
- `GET /api/cars` - Listar todos os carros
- `GET /api/cars/<car_id>` - Obter detalhes de um carro

### Reservas de Carros
- `GET /api/car-reservations` - Listar reservas de carros (filtros opcionais: date, carId)
- `POST /api/car-reservations` - Criar uma nova reserva de carro
- `PUT /api/car-return` - Registrar devolução de um carro

### Usuários
- `GET /api/users` - Listar todos os usuários
- `POST /api/users` - Criar um novo usuário
- `PUT /api/users/<user_id>` - Atualizar um usuário
- `DELETE /api/users/<user_id>` - Excluir um usuário

## Estrutura do Banco de Dados

- `users`: Usuários do sistema
- `rooms`: Salas disponíveis
- `room_reservations`: Reservas de salas
- `cars`: Carros disponíveis
- `car_reservations`: Reservas de carros
