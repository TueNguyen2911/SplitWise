import { resolve } from 'path'
import fs from 'fs'
import { addDoc, setDoc, doc, collection } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDEE8Js8iCA1jHHYWzZOnWkDJhKvgVdbH4',
  authDomain: 'splitwise-83ca0.firebaseapp.com',
  projectId: 'splitwise-83ca0',
  storageBucket: 'splitwise-83ca0.appspot.com',
  messagingSenderId: '28731846735',
  appId: '1:28731846735:web:c71c48fb172396b7eefa3a',
  measurementId: 'G-3YFM72C1BJ'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
//npm run upload <json file> <method> <collection Name>
//npm run upload upload/events.json set Events
//change "event_id" accordingly

class PopulateJsonFireStore {
  // class constructor
  constructor() {
    console.time('Time taken')
    this.db = db
    // Obtain the relative path, method type, collection name arguments provided through
    const [, , filepath, type, collectionname] = process.argv

    // Obtain the absolute path for the given relative
    this.absolutepath = resolve(process.cwd(), filepath)

    // Obtain the firestore method type
    this.type = type

    // Obtain the firestore method type
    this.collectionname = collectionname

    // Lets make sure the right firestore method is used.
    if (this.type !== 'set' && this.type !== 'add') {
      console.error(`Wrong method type ${this.type}`)
      console.log('Accepted methods are: set or add')
      this.exit(1)
    }

    // If file path is missing
    if (this.absolutepath == null || this.absolutepath.length < 1) {
      console.error(`Make sure you have file path assigned ${this.absolutepath}`)
      this.exit(1)
    }

    // If collection name not set
    if (this.collectionname == null || this.collectionname.length < 1) {
      console.error(`Make sure to specify firestore collection ${this.collectionname}`)
      this.exit(1)
    }

    console.log(`ABS: FILE PATH ${this.absolutepath}`)
    console.log(`Type: method is ${this.type}`)
  }

  // The populate function
  // uploads the json data to firestore
  async populate() {
    // initialize our data array
    let data = []

    // Get data from json file using fs
    try {
      data = JSON.parse(fs.readFileSync(this.absolutepath, {}), 'utf8')
    } catch (e) {
      console.error(e.message)
    }

    //data.forEach((item) => console.log(item));
    // loop through the data
    // Populate Firestore on each run
    // Make sure file has atleast one item.
    if (data.length < 1) {
      console.error('Make sure file contains items.')
    }
    var i = 0
    for (var item of data) {
      console.log(item)
      try {
        this.type === 'set' ? await this.set(item) : await this.add(item)
      } catch (e) {
        console.log(e.message)
        this.exit(1)
      }
      // Successfully got to end of data;
      // print success message
      if (data.length - 1 === i) {
        console.log(
          '**************************\n****SUCCESS UPLOAD*****\n**************************'
        )
        console.timeEnd('Time taken')
        this.exit(0)
      }

      i++
    }
  }

  // Sets data to firestore database
  // Firestore auto generated IDS
  // Outdated function, don't use
  add(item) {
    console.log(`Adding item with id ${item.event_id}`)
    return addDoc(collection(db, `${this.collectionname}`), item)
  }

  // Set data with specified ID
  // Custom Generated IDS
  // change "event_id" accordingly
  set(item) {
    console.log(`setting item with id ${item.id}`)
    return setDoc(doc(this.db, `${this.collectionname}`, `${item.id}`), Object.assign({}, item))
  }

  // Exit nodejs console
  exit(code) {
    return process.exit(code)
  }
}

// create instance of class
// Run populate function
const populateFireStore = new PopulateJsonFireStore()
populateFireStore.populate()
