const mongoose = require('mongoose');

let quizID = 8;
let profileID = 3;
let resultID = 1;

// TODO: NOTE: delete this pls thx bye
// I created this test data to be able to test most features.
// This is bad practice in real life. You should be putting this in a database and encrypting
// passwords.

let quizzes = [{
    id: 1,
    title: 'Geography Test',
    genre: 1,
    type: 'fill',
    timeLimit: 120,
    authorID: 1,
    questions: [
        {
            question: 'Where can you find the Statue of Liberty?',
            answer: 'New York',
            file: 'statue-of-liberty.jpg'
        },
        {
            question: 'What is the largest state in the United States?',
            answer: 'Alaska',
            file: null
        },
        {
            question: 'What is the largest country in the world?',
            answer: 'Russia',
            file: 'earth.mp4'
        },
        {
            question: 'What is this sound?',
            answer: 'What',
            file: 'sound.mp3'
        },
        {
            question: 'Where can you find Paris?',
            answer: 'France',
            file: null
        },
    ]
}, {
    id: 2,
    title: 'How\'s Earth?',
    genre: 1,
    type: 'torf',
    timeLimit: 60,
    authorID: 1,
    questions: [
        {
            question: 'Are we currently experience human-induced climate change?',
            answer: true,
            file: null
        }
    ]
}, {
    id: 3,
    title: 'How\'s Earth?',
    genre: 1,
    type: 'torf',
    timeLimit: 60,
    authorID: 1,
    questions: [
        {
            question: 'Are we currently experience human-induced climate change?',
            answer: true,
            file: null
        }
    ]
}, {
    id: 4,
    title: 'How\'s Earth?',
    genre: 1,
    type: 'torf',
    timeLimit: 60,
    authorID: 1,
    questions: [
        {
            question: 'Are we currently experience human-induced climate change?',
            answer: true,
            file: null
        }
    ]
}, {
    id: 5,
    title: 'How\'s Earth?',
    genre: 1,
    type: 'torf',
    timeLimit: 60,
    authorID: 1,
    questions: [
        {
            question: 'Are we currently experience human-induced climate change?',
            answer: true,
            file: null
        }
    ]
}, {
    id: 6,
    title: 'How\'s Earth?',
    genre: 1,
    type: 'torf',
    timeLimit: 60,
    authorID: 1,
    questions: [
        {
            question: 'Are we currently experience human-induced climate change?',
            answer: true,
            file: null
        }
    ]
}, {
    id: 7,
    title: 'How\'s Earth?',
    genre: 1,
    type: 'torf',
    timeLimit: 60,
    authorID: 1,
    questions: [
        {
            question: 'Are we currently experience human-induced climate change?',
            answer: true,
            file: null
        }
    ]
}];

let genres = [
    { id: 1, name: 'Geography', image: '/images/geography.jpg' },
    { id: 2, name: 'Movies', image: '/images/movies.jpg' },
    { id: 3, name: 'Sports', image: '/images/sports.jpg' },
    { id: 4, name: 'Academic', image: '/images/academic.jpg' },
    { id: 5, name: 'TV', image: '/images/tv.jpg' },
    { id: 6, name: 'Vocabulary', image: '/images/vocabulary.jpg' },
    { id: 7, name: 'History', image: '/images/history.jpg' },
    { id: 8, name: 'Trivias', image: '/images/trivias.jpg' },
    { id: 9, name: 'Music', image: '/images/music.jpg' }
];

let profiles = [
    { id: 1, name: 'user_1', password: 'password' },
    { id: 2, name: 'user_2', password: 'password' }
];

let results = [];

const data = {
    createQuiz: (data) => {
        data.id = quizID++;
        quizzes.push(data);
        data.save();
        return Promise.resolve(data);

    },

    getQuiz: (id) => {
        var index = quizzes.findIndex(e => e.id === id);
        if (index !== -1) {
            return Promise.resolve(quizzes[index]);
        } else {
            return Promise.reject('Cannot find quiz.');
        }
    },

    isAuthorOfQuiz: (userId, quizId) => {
        var index = quizzes.findIndex(e => e.id == quizId && e.authorID == userId);
        return Promise.resolve(index !== -1);
    },

    editQuiz: (id, data) => {
        var index = quizzes.findIndex(e => e.id === id);
        if (index !== -1) {
            quizzes[index] = data;
            quizzes[index].id = id;
            return Promise.resolve(quizzes[index]);
        } else {
            return Promise.reject('Cannot find quiz.');
        }
    },

    getGenres: () => {
        return Promise.resolve(genres);
    },

    getGenre: (genreID) => {
        var index = genres.findIndex(e => e.id === genreID);
        if (index !== -1) {
            return Promise.resolve(genres[index]);
        } else {
            return Promise.reject('Cannot find genre.');
        }
    },

    getQuizzes: () => {
        return Promise.resolve(quizzes.map(e => {
            e.author = profiles.find(profile => profile.id === e.authorID);
            e.genre = genres.find(g => g.id === e.genre);
            e.plays = results.filter(r => r.quizID === e.id);
            return e;
        }));
    },

    getQuizzesByGenre: (genreID) => {
        return Promise.resolve(quizzes.filter(e => e.genre === genreID).map(e => {
            e.author = profiles.find(profile => profile.id == e.authorID);
            return e;
        }));
    },

    changePassword: (userid, oldPass, newPass, confirmPass) => {
        var index = profiles.findIndex(e => e.id === userid);
        if (index !== -1) {
            var profile = profiles[index];
            if (profile.password !== oldPass) {
                return Promise.reject('Old password does not match current password.');
            } else if (oldPass === newPass) {
                return Promise.reject('Old password is the same as the new password.');
            } else if (newPass !== confirmPass) {
                return Promise.reject('New password and confirm password do not match.');
            } else {
                profile.password = newPass;
                return Promise.resolve();
            }
        } else {
            return Promise.reject('Cannot find profile.');
        }
    },

    changeName: (userid, newName) => {
        if (profiles.findIndex(e => e.name === newName) !== -1) {
            return Promise.reject('Another user with the same name exists.');
        }

        var index = profiles.findIndex(e => e.id === userid);
        if (index !== -1) {
            var profile = profiles[index];
            profile.name = newName;
            return Promise.resolve();
        } else {
            return Promise.reject('Cannot find profile.');
        }
    },

    authenticate: (username, password) => {
        var index = profiles.findIndex(e => e.name === username && e.password === password);
        if (index !== -1) {
            var profile = profiles[index];
            return Promise.resolve({
                id: profile.id,
                name: profile.name
            });
        } else {
            return Promise.reject('Invalid username or password.');
        }
    },

    register: (username, password) => {
        if (profiles.findIndex(e => e.name === username) !== -1) {
            return Promise.reject('Another user with the same name exists.');
        }
        
        var profile = {
            id: profileID++,
            name: username,
            password
        };
        profiles.push(profile);
        return Promise.resolve({
            id: profile.id,
            name: profile.name
        });
    },

    getProfile: id => {
        var index = profiles.findIndex(e => e.id === id);
        if (index !== -1) {
            var profile = profiles[index];
            return Promise.resolve({
                id: profile.id,
                name: profile.name
            });
        } else {
            return Promise.reject('Cannot find profile.');
        }
    },

    addResult: (quizID, takerID, score, elapsed) => {
        var quiz = quizzes.find(e => e.id === quizID);
        var result = {
            id: resultID++,
            quizID,
            quizTitle: quiz ? quiz.title : '',
            takerID,
            score,
            total: quiz ? quiz.questions.length : 0,
            elapsed,
            date: Date.now()
        };

        results.push(result);
        return Promise.resolve(result);
    },

    getResult: id => {
        var index = results.findIndex(e => e.id === id);
        if (index !== -1) {
            return Promise.resolve(results[index]);
        } else {
            return Promise.reject('Cannot find result.');
        }
    }
};

module.exports = data;
