# 📋 Sistema Kanban - Angular + Spring Boot + MySQL

Um sistema completo de gerenciamento de tarefas estilo Kanban, com frontend em Angular e backend em Spring Boot.

## 🚀 Tecnologias

### Frontend
- **Angular 20** - Framework frontend
- **Angular CDK** - Drag and Drop
- **TypeScript** - Linguagem principal
- **CSS3** - Estilização moderna

### Backend
- **Spring Boot 3.2.5** - Framework backend
- **Spring Data JPA** - Persistência de dados
- **MySQL 8** - Banco de dados
- **Java 17** - Linguagem backend

## 📁 Estrutura do Projeto

```
projeto/
├── src/                    # Frontend Angular
│   ├── app/
│   │   ├── app.html       # Template do Kanban
│   │   ├── app.css        # Estilos do Kanban
│   │   └── app.ts         # Lógica do componente
│   └── ...
├── backend/               # Backend Spring Boot
│   ├── src/main/java/com/kanban/
│   │   ├── KanbanApplication.java
│   │   ├── controller/    # Controllers REST
│   │   ├── model/         # Entidades JPA
│   │   ├── repository/    # Repositórios
│   │   └── service/       # Serviços
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql
│   └── pom.xml
└── README.md
```

## 🛠️ Configuração do Ambiente

### 1. Pré-requisitos

- **Node.js 18+** e **npm**
- **Java 17+**
- **Maven 3.8+**
- **MySQL 8+**

### 2. Configuração do Banco de Dados

```sql
-- Criar banco de dados
CREATE DATABASE kanban_db;

-- Criar usuário (opcional)
CREATE USER 'kanban_user'@'localhost' IDENTIFIED BY 'kanban_pass';
GRANT ALL PRIVILEGES ON kanban_db.* TO 'kanban_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configuração do Backend

```bash
cd backend

# Editar application.properties se necessário
# Configurar URL, usuário e senha do MySQL

# Compilar e executar
mvn clean install
mvn spring-boot:run
```

O backend estará rodando em: `http://localhost:8080`

### 4. Configuração do Frontend

```bash
# Na raiz do projeto
npm install
npm start
```

O frontend estará rodando em: `http://localhost:4200`

## 🔌 API Endpoints

### Tasks

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/tasks` | Listar todas as tarefas |
| GET | `/api/tasks/{id}` | Buscar tarefa por ID |
| GET | `/api/tasks/status/{status}` | Listar por status |
| POST | `/api/tasks` | Criar nova tarefa |
| PUT | `/api/tasks/{id}` | Atualizar tarefa |
| PATCH | `/api/tasks/{id}/status` | Atualizar apenas status |
| DELETE | `/api/tasks/{id}` | Excluir tarefa |

### Exemplos de Uso

**Criar nova tarefa:**
```bash
curl -X POST http://localhost:8080/api/tasks 
  -H "Content-Type: application/json" 
  -d '{
    "title": "Nova Tarefa",
    "description": "Descrição da tarefa",
    "assignee": "João",
    "priority": "ALTA",
    "status": "TODO",
    "dueDate": "2025-08-30"
  }'
```

**Atualizar status:**
```bash
curl -X PATCH http://localhost:8080/api/tasks/1/status 
  -H "Content-Type: application/json" 
  -d '{"status": "DOING"}'
```

## 🎯 Funcionalidades

### ✅ Implementadas

- ✅ **Board Kanban** com 3 colunas (A Fazer, Em Progresso, Concluído)
- ✅ **Drag & Drop** entre colunas com sincronização backend
- ✅ **CRUD completo** de tarefas (frontend + backend)
- ✅ **Prioridades** (Baixa, Média, Alta) com cores
- ✅ **Interface responsiva** e moderna
- ✅ **API REST** completa e testada
- ✅ **Integração frontend ↔ backend** funcionando
- ✅ **Validações** backend e frontend
- ✅ **Banco MySQL** com dados persistidos
- ✅ **CORS configurado** corretamente
- ✅ **Indicadores de loading** e tratamento de erros
- ✅ **Fallback para modo offline**

### 🔄 Próximas Melhorias

- 🔄 Autenticação JWT e controle de acesso
- 🔄 Filtros por usuário, data, prioridade
- 🔄 Histórico de mudanças e auditoria
- 🔄 Notificações em tempo real (WebSocket)
- 🔄 Anexos de arquivos nas tarefas
- 🔄 Comentários e colaboração
- 🔄 Dashboard com métricas

## 🎨 Características da Interface

- **Design moderno** com gradientes e glassmorphism
- **Cores intuitivas** para prioridades
- **Animações suaves** para interações
- **Layout responsivo** para mobile e desktop
- **Drag & Drop** visual com feedback

## 📊 Modelo de Dados

### Task
```java
{
  "id": Long,
  "title": String,
  "description": String,
  "assignee": String,
  "priority": "BAIXA" | "MEDIA" | "ALTA",
  "status": "TODO" | "DOING" | "DONE",
  "dueDate": LocalDate,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime
}
```

## 🚀 Como Executar

1. **Iniciar MySQL** e criar o banco `kanban_db`
2. **Executar backend**: `cd backend && mvn spring-boot:run`
3. **Executar frontend**: `npm start`
4. **Acessar**: http://localhost:4200

## 🔧 Resolução de Problemas

### Erro de CORS
- Verifique se o frontend está rodando na porta 4200
- Configure `spring.web.cors.allowed-origins` no application.properties

### Erro de Conexão MySQL
- Verifique se o MySQL está rodando
- Confirme usuário/senha no application.properties
- Certifique-se que o banco `kanban_db` existe

### Erro de Dependências
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
mvn clean install
```

## 📝 Próximos Passos

1. **Conectar frontend ao backend** (substituir dados mock)
2. **Implementar autenticação** JWT
3. **Adicionar filtros** por usuário/data
4. **Implementar notificações** em tempo real
5. **Adicionar testes** automatizados

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Angular + Spring Boot**
