const fs = require("node:fs");
const { v4 } = require("uuid");
const path = require("node:path");

const basePath = path.join(process.cwd(), "/data/docs/");

const ensureCollectionPath = (collection) => {
  const collectionPath = path.join(basePath, collection);
  if (!fs.existsSync(collectionPath)) {
    fs.mkdirSync(collectionPath, { recursive: true });
  }
  return collectionPath;
};

class DB {
  constructor(collection) {
    this.collection = collection;
    ensureCollectionPath(collection);
  }

  create(content) {
    const id = v4();
    const collectionPath = ensureCollectionPath(this.collection);
    fs.writeFileSync(
      path.join(collectionPath, id + ".json"),
      JSON.stringify({ id, ...content })
    );
    const obj = {
      message: "Doc created successfully",
      insertedId: id,
    };
    console.log(obj);
    return obj;
  }

  get(id = null) {
    const collectionPath = ensureCollectionPath(this.collection);
    if (id) {
      const filePath = path.join(collectionPath, id + ".json");
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
      } else {
        const msg = { message: "No Doc found" };
        console.log(msg);
        return msg;
      }
    } else {
      const folder = fs.readdirSync(collectionPath);
      const files = folder.map((file) =>
        JSON.parse(fs.readFileSync(path.join(collectionPath, file), "utf8"))
      );
      console.log(files);
      return files;
    }
  }

  find(query) {
    const all = this.get();
    const matches = all.filter((doc) => {
      for (const [key, value] of Object.entries(query)) {
        if (doc[key] !== value) {
          return false;
        }
      }
      return true;
    });

    if (matches.length === 1) {
      console.log(matches[0]);
      return matches[0];
    } else {
      console.log(matches);
      return matches;
    }
  }

  del(id) {
    const collectionPath = ensureCollectionPath(this.collection);
    const filePath = path.join(collectionPath, id + ".json");
    if (fs.existsSync(filePath)) {
      const fileContent = JSON.parse(fs.readFileSync(filePath, "utf8"));
      fs.rmSync(filePath);
      const msg = {
        message: "Doc deleted successfully",
        deletedId: id,
        content: fileContent,
      };
      console.log(msg);
      return msg;
    } else {
      const msg = { message: "No Doc found" };
      console.log(msg);
      return msg;
    }
  }
}

const db = {
  collection: (collectionName) => new DB(collectionName),
};

module.exports = db;
