/**
 * This script runs automatically after your first npm / yarn install.
 */
const inquirer = require('inquirer')
const {
  mv,
  rm,
  which,
  exec
} = require("shelljs")
const replace = require("replace-in-file")
const colors = require("colors")
const path = require("path")
const {
  readFileSync,
  writeFileSync
} = require("fs")
const {
  fork
} = require("child_process")

// Note: These should all be relative to the project root directory
const rmDirs = [
  // ".git"
]
const rmFiles = [
  "tools"
]

const renameFiles = []

const modifyFiles = [
  "LICENSE",
  "package.json",
  ".github/.funding.yml",
  ".github/.dependabot.yml"
]

var questions = [
  {
    type: 'confirm',
    name: 'projectname',
    message: 'Would you like it to be called "' + libraryNameSuggested(),
  },
  {
    type: 'input',
    name: 'reponame',
    message: "What do you want the project to be called? (use kebab-case)",
    validate: function (value) {
      var pass = value.match(
        /^[a-z]+(\-[a-z]+)*$/i
      );
      if (pass) {
        return true;
      }

      return 'kebab-case" uses lowercase letters, and hyphens for any punctuation';
    },
    when: function (answers) {
      return !answers.projectname;
    },
  },
  {
    type: 'input',
    name: 'username',
    message: "What is your Github username? (use kebab-case)",
    validate: function (value) {
      var pass = value.match(
        /^[a-z]+(\-[a-z]+)*$/i
      );
      if (pass) {
        return true;
      }

      return 'kebab-case" uses lowercase letters, and hyphens for any punctuation';
    },
  },

]

inquirer
  .prompt(questions)
  .then(answers => {
    const projectname = answers.projectname ? libraryNameSuggested() : answers.reponame
    setupLibrary(projectname, answers.username)
  })
  .catch(error => {
    if (error) {
      console.log(colors.red("Sorry, there was an error building the workspace :("))
      removeItems()
      process.exit(1)
    }
  })

/**
 * The library name is suggested by looking at the directory name of the
 * tools parent directory and converting it to kebab-case
 *
 * The regex for this looks for any non-word or non-digit character, or
 * an underscore (as it's a word character), and replaces it with a dash.
 * Any leading or trailing dashes are then removed, before the string is
 * lowercased and returned
 */
function libraryNameSuggested() {
  return path
    .basename(path.resolve(__dirname, ".."))
    .replace(/[^\w\d]|_/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

/**
 * Calls all of the functions needed to setup the repo
 *
 * @param projectName
 */
function setupLibrary(projectName, username) {
  console.log(
    colors.cyan(
      "\nThanks for the info. The last few changes are being made... hang tight!\n\n"
    )
  )

  // Get the Git username and email before the .git directory is removed
  let userfull = exec("git config user.name").stdout.trim()
  let useremail = exec("git config user.email").stdout.trim()

  removeItems()

  modifyContents(projectName, userfull, username, useremail)

  renameItems(projectName)

  finalize()

  console.log(colors.cyan("OK, you're all set. Happy coding!! ;)\n"))
}

/**
 * Removes items from the project that aren't needed after the initial setup
 */
function removeItems() {
  console.log(colors.underline.white("Removed"))

  // The directories and files are combined here, to simplify the function,
  // as the 'rm' command checks the item type before attempting to remove it
  let rmItems = rmDirs.concat(rmFiles)
  rm("-rf", rmItems.map(f => path.resolve(__dirname, "..", f)))
  console.log(colors.red(rmItems.join("\n")))

  console.log("\n")
}

/**
 * Updates the contents of the template files with the library name or user details
 *
 * @param projectName
 * @param username
 * @param useremail
 */
function modifyContents(projectName, userfull, username, useremail) {
  console.log(colors.underline.white("Modified"))

  let files = modifyFiles.map(f => path.resolve(__dirname, "..", f))
  try {
    const changes = replace.sync({
      files,
      from: [/--projectname--/g, /--userfull--/g, /--username--/g, /--useremail--/g],
      to: [projectName, userfull, username, useremail]
    })
    console.log(colors.yellow(modifyFiles.join("\n")))
  } catch (error) {
    console.error("An error occurred modifying the file: ", error)
  }

  console.log("\n")
}

/**
 * Renames any template files to the new project name
 *
 * @param projectName
 */
function renameItems(projectName) {
  console.log(colors.underline.white("Renamed"))

  renameFiles.forEach(function (files) {
    // Files[0] is the current filename
    // Files[1] is the new name
    let newFilename = files[1].replace(/--projectname--/g, projectName)
    mv(
      path.resolve(__dirname, "..", files[0]),
      path.resolve(__dirname, "..", newFilename)
    )
    console.log(colors.cyan(files[0] + " => " + newFilename))
  })

  console.log("\n")
}

/**
 * Calls any external programs to finish setting up the library
 */
function finalize() {
  console.log(colors.underline.white("Finalizing"))

  // Recreate Git folder
  let gitInitOutput = exec('git init "' + path.resolve(__dirname, "..") + '"', {
    silent: true
  }).stdout
  console.log(colors.green(gitInitOutput.replace(/(\n|\r)+/g, "")))

  // Remove post-install command
  let jsonPackage = path.resolve(__dirname, "..", "package.json")
  const pkg = JSON.parse(readFileSync(jsonPackage))

  console.log('pkg', pkg)

  // Note: Add items to remove from the package file here
  delete pkg.scripts.postinstall

  writeFileSync(jsonPackage, JSON.stringify(pkg, null, 2))
  console.log(colors.green("Postinstall script has been removed"))

  // Initialize Husky
  fork(
    path.resolve(__dirname, "..", "node_modules", "husky", "bin", "install"), {
      silent: true
    }
  );
  console.log(colors.green("Git hooks set up"))

  console.log("\n")
}
