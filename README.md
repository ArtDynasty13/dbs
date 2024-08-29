# DBS Patient Self-Referral Pathway

This web application is a prototype self-referral pathway for Deep Brain Stimulation (DBS) patients. It was solo-developed over July-Aug 2024 as a summer internship research project under Dr. Fang Ba. The goal is to streamline the referral process, making it easier for patients to access the care they need, by interfacting with AHS ConnectCare. 

## Logic

Determination of successful candidacy is based on the 5-2-1 rule (second and third question must have at least one 'yes') and contra-indications in later questions relating to depression, dementia, psychosis, etc. Other information (gait balance impairment, tremor) and recorded but do not affect outcome.

SUCCESS - patients will be shown their results, along with an instruction to print this report and show it to their physician. In the future, the actual pathway will go directly to the neurologist through AHS ConnectCare chat.

FAILURE - a non-candidacy message is shown to the user

## Editing

Server.js - runs the server on localhost:3000. The site also runs on Github pages.

Static Folder
 - CSS Folder
       - styles.css - styling for buttons, layout, font size, etc.
    - Fonts Folder
        - Holds Google font for text. Accessed by styles.css
    - js Folder*
        - scripts.js - handles the majority of the logic and content. Can edit questions, medications (names, dosages, frequencycalculations of LEDD), progression, messages, etc.

*goes w/out saying, but this is the bulk of the code.

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [GitHub Desktop](https://desktop.github.com/) (optional)

### Installation

You can either use the command line or GitHub Desktop to clone the repository.

#### Option 1: Command Line

1. **Clone the repository**:

    Open your terminal (Command Prompt, Git Bash, etc.) and run:

    ```bash
    git clone https://github.com/ArtDynasty13/dbs.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd dbs
    ```

3. **Install dependencies**:

    Run the following command to install all necessary packages:

    ```bash
    npm install
    ```

4. **Start the development server**:

    You have two options to start the server:

    - **Option A**: Use npm start (recommended):

        ```bash
        npm start
        ```

    - **Option B**: Run `server.js` directly using Node.js:

        ```bash
        node server.js
        ```

    Both options will start your application on `http://localhost:3000`. Open your web browser and navigate to this URL to see the application.

#### Option 2: GitHub Desktop

1. **Clone the repository**:

    - Open GitHub Desktop and sign in with your GitHub account.
    - Click on `File > Clone repository`.
    - In the `URL or username/repository` field, enter `https://github.com/ArtDynasty13/dbs.git`.
    - Choose a local path where you want to save the project, then click `Clone`.

2. **Navigate to the project directory**:

    - After cloning, click on `Repository > Open in Terminal` to open the terminal in the project's directory.

3. **Install dependencies**:

    In the terminal that opens, run:

    ```bash
    npm install
    ```

4. **Start the development server**:

    You can start the server using one of these two commands:

    - **Option A**: Use npm start (recommended):

        ```bash
        npm start
        ```

    - **Option B**: Run `server.js` directly using Node.js:

        ```bash
        node server.js
        ```

    Open your web browser and navigate to `http://localhost:3000` to view the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please contact:

- **Arthur** - arthurwitte18[at]gmail[dot]com
- GitHub: [ArtDynasty13](https://github.com/ArtDynasty13)
