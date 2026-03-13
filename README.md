# SQL Canvas

SQL Canvas is a platform-independent, lightweight, and modern-looking SQL IDE. It features a sleek code editor powered by Monaco Editor and dynamic output display, delivering a state-of-the-art developer experience for Oracle Database users.

## Features
- **Modern UI/UX**: Designed with a focus on visual aesthetics and usability.
- **Advanced Code Editor**: Built with Monaco Editor (the editor that powers VS Code) for robust syntax highlighting, autocomplete, and seamless coding.
- **Cross-Platform**: Packaged as a single desktop application using Electron, available on Windows, macOS, and Linux.
- **Oracle DB Integration**: Native connection to Oracle Database using `oracledb`.

## Tech Stack
- Frontend: React 19, Vite
- Editor: Monaco Editor
- Backend/Desktop: Electron, Node.js
- Database: Oracle XE, `oracledb`, Docker

## Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js (v18+)
- Docker and Docker Compose (to run the local Oracle Database)

## Getting Started

1. **Clone the repository** (if not already done):
   ```bash
   git clone https://github.com/DebangshuChakraborty/sql-canvas.git
   cd sql-canvas
   ```

2. **Start the Oracle Database**
   The project includes a `docker-compose.yml` file to quickly spin up an Oracle XE instance with a predefined user:
   ```bash
   docker-compose up -d
   ```
   *Note: It might take a minute or two for the database to fully initialize on the first run.*

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run the Application in Development Mode**
   This command starts the Vite development server and launches the Electron application concurrently:
   ```bash
   npm run dev
   ```

## Local Database Credentials
By default, the `docker-compose.yml` configures an Oracle XE environment with the following credentials:
- **Port:** `1522` (mapped to `1521` internally)
- **App User:** `user_db`
- **App Password:** `user_db`
- **System Password:** `system`

## Building for Production
To package the app into a single executable for distribution, run:
```bash
npm run build
```
This uses `electron-builder` to generate the output in the `dist-electron` folder.

## Author
**Debangshu Chakraborty**

## License
MIT License

Copyright (c) 2026 Debangshu Chakraborty

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
