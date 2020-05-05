const fs = require('fs');

firebase.initializeApp({
    apiKey: "AIzaSyDbzKmYPxhrsUyMX94mCpKdPiP7LXIFjjM",
    authDomain: "ludum-pro-bono.firebaseapp.com",
    databaseURL: "https://ludum-pro-bono.firebaseio.com",
    projectId: "ludum-pro-bono",
    storageBucket: "ludum-pro-bono.appspot.com",
    messagingSenderId: "538425537714",
    appId: "1:538425537714:web:79c14527e3a4b28e"
});

const firebaseDatabase = firebase.database().ref();

firebaseDatabase.child('pacmaze').child('fases').on('value', snap => {
    let fases = [];
    let ids = [];

    snap.forEach(snap => {
        fases.push(snap.val());
        ids.push(snap.key);
    });

    fs.writeFile('data/pacmaze/fases.json', JSON.stringify([fases, ids]), erro => {
        if (!!erro) console.log('Pacmaze: ' + erro);
        else console.log('Pacmaze: fases atualizadas');
    });
});