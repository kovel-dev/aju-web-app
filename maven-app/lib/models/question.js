import axios from 'axios'
import { server } from 'lib/config/server'

class Question {
  static getQuestionsByCheckout = async () => {
    return await axios
      .get(`${server}/api/question/get-questions-by-checkout`)
      .then((response) => {
        return response
      })
      .catch((error) => {
        throw error.response.data
      })
  }
}

export default Question
