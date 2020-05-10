import axios from 'axios';

export default axios.create({
    baseURL: 'http://scab-blockchain.herokuapp.com'
});