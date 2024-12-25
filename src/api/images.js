import httpClient from "./httpClient.js";
import axios from "axios";
import store from '../store';

// const store = useStore(); 
const url = 'images'

export const imagesApi = {

  delImage(id) {
    try {
      return httpClient.post(`${url}/delete`, {
        image_id: id
      }).then(({ data }) => {
        return data
      })
    } catch (err) {
      console.log(err)
    }
  }

}