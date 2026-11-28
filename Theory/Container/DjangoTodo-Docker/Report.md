# Experiment 16: Containerization of Django Todo Task Manager Using Docker

## Aim
To package an existing Django Todo Task Manager in a Docker image, run it in a container, expose it through a host port, and demonstrate persistence of SQLite data after the container is stopped, removed, and recreated.

## Application Overview
The existing Django Todo application supports creating, viewing, editing, searching, completing, and deleting tasks. It also supports optional deadlines, task status filters, and task statistics. The existing application code is retained; Docker-specific configuration is used for container execution.

## Technologies Used
- Python and Django — backend application
- HTML and CSS — user interface
- SQLite — task database
- Docker — image building and container execution
- Gunicorn — application server inside the container
- VS Code and Windows PowerShell — development and commands

## Project Structure
```text
DjangoTodo-Docker/
├── Dockerfile
├── .dockerignore
├── requirements.txt
├── README.md
├── manage.py
├── todo/
├── todoproject/
├── docker-data/
│   └── db.sqlite3
└── screenshots/
    ├── 01-docker-build.png
    ├── 02-running-container.png
    ├── 03-application.png
    ├── 04-database.png
    ├── 05-container-removed.png
    ├── 06-container-recreated.png
    └── 07-data-persistence.png
```

## Docker Configuration
The Docker image uses a Python base image, installs dependencies from `requirements.txt`, copies the Django source, exposes container port **8000**, and starts the application bound to **0.0.0.0:8000**. The container runs database migrations at startup. The SQLite database is stored in `/app/data/db.sqlite3`, with `/app/data` mounted from the host's `docker-data` folder.

**Port mapping:** `8080:8000` means Windows port 8080 forwards requests to container port 8000.

**Bind mount:** `"${PWD}/docker-data:/app/data"` means files in `/app/data` persist in the local `docker-data` folder independently of the container lifecycle.

## Procedure and Commands (Windows PowerShell)
Run the following commands in the folder containing the `Dockerfile` and `manage.py`. Docker Desktop must be installed and its engine running.

### 1. Verify Docker
```powershell
docker --version
docker info
```

### 2. Build and Verify the Image
```powershell
docker build -t todo-app:v1 .
docker images
```
**Evidence:** `screenshots/01-docker-build.png` — successful build and image listing.

### 3. Prepare the Persistent Data Directory
```powershell
New-Item -ItemType Directory -Force -Path .\docker-data
```
If an existing SQLite database is required, ensure its copy is in `docker-data` before starting the container. Do not delete this folder during the persistence test.

### 4. Start and Inspect the Container
```powershell
docker run -d --name todo-app -p 8080:8000 -v "${PWD}/docker-data:/app/data" todo-app:v1
docker ps
docker logs todo-app
```
**Evidence:** `screenshots/02-running-container.png` — running `todo-app` with `8080->8000` port mapping.

### 5. Test the Application
Open **http://localhost:8080** in a browser. Create a sample task named **Docker Persistence Test** and confirm it appears. You may also test edit, complete, search, and delete with separate sample tasks.

**Evidence:** `screenshots/03-application.png` — running application and saved test task.

### 6. Verify Persistent Storage
```powershell
Get-ChildItem .\docker-data
docker exec todo-app ls -l /app/data
docker exec todo-app python manage.py shell -c "from todo.models import Task; print(list(Task.objects.values_list('title', flat=True)))"
```
Confirm that `db.sqlite3` exists in the host directory and inside the mounted container directory.

**Evidence:** `screenshots/04-database.png` — database file in `docker-data`.

### 7. Stop and Remove the Container
```powershell
docker stop todo-app
docker rm todo-app
docker ps -a
```
The container should no longer appear in the list. The host `docker-data` directory must remain unchanged.

**Evidence:** `screenshots/05-container-removed.png` — stop/remove output and container listing.

### 8. Recreate the Container with the Same Bind Mount
```powershell
docker run -d --name todo-app -p 8080:8000 -v "${PWD}/docker-data:/app/data" todo-app:v1
docker ps
```
**Evidence:** `screenshots/06-container-recreated.png` — newly running container.

### 9. Confirm Data Persistence
Reopen **http://localhost:8080** and verify that **Docker Persistence Test** is still present.

Optionally check the database from inside the new container:
```powershell
docker exec todo-app python manage.py shell -c "from todo.models import Task; print(list(Task.objects.values_list('title', flat=True)))"
```
**Evidence:** `screenshots/07-data-persistence.png` — original task visible after container recreation.

## Essential Docker Commands
| Command | Purpose |
|---|---|
| `docker --version` | Display installed Docker CLI version |
| `docker info` | Check Docker engine information |
| `docker build -t todo-app:v1 .` | Build the application image |
| `docker images` | List available images |
| `docker run -d ...` | Create and start the container |
| `docker ps` | List running containers |
| `docker ps -a` | List all containers, including stopped ones |
| `docker logs todo-app` | View application startup and error logs |
| `docker exec todo-app ...` | Run a command inside the running container |
| `docker stop todo-app` | Stop the container |
| `docker rm todo-app` | Remove the stopped container |

## Challenges and Solutions
- **Docker command not recognized:** Restarted the terminal or corrected the Windows PATH so `docker.exe` was available.
- **Docker engine not running:** Opened Docker Desktop and checked `docker info` before building.
- **Container accessibility:** Used `0.0.0.0:8000` inside the container and mapped host port 8080.
- **Risk of database loss:** Used a host bind mount and stored SQLite data in `/app/data` rather than only in the container filesystem.
- **Proving persistence:** Created a task, removed the container, recreated it with the same mount, and checked for the original task.

## Screenshot Checklist
| No. | Screenshot file | Required proof |
|---|---|---|
| 1 | `01-docker-build.png` | Image build completed successfully |
| 2 | `02-running-container.png` | Container running with mapped port |
| 3 | `03-application.png` | Application accessible in browser with saved task |
| 4 | `04-database.png` | Database present in `docker-data` |
| 5 | `05-container-removed.png` | Original container stopped and removed |
| 6 | `06-container-recreated.png` | New container started using same bind mount |
| 7 | `07-data-persistence.png` | Previously saved task still available |

## Outcome / Result
The experiment demonstrates how to build and run a Django Todo application in Docker and configure host-mounted SQLite storage. **The persistence requirement is verified when the task created before container removal remains visible after a new container starts with the same `docker-data` mount.** Attach the actual command outputs and screenshots to document the results obtained on your system.

## Submission Notes
Submit the project source, `Dockerfile`, `.dockerignore`, dependency file, `README.md`, the `docker-data` directory containing demonstration data, this report, and seven screenshots. Do not include sensitive or personal data in the sample database.
