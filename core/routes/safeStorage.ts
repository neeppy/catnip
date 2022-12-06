export default [
    {
        channel: 'encrypt',
        async handle(data) {
            console.log('Data received', data);
        }
    },
    {
        channel: 'decrypt',
        async handle(data) {
            console.log('Data received', data);
        }
    },
];
