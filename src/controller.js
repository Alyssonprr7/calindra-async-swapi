const axios = require("axios")

class Controller {
	async index(request,response){
		
		try{
			const {id} = request.params;
			const fields = request.query.enrichFields;

			const filmRequest = await axios.get(`https://swapi.dev/api/films/${id}/`)
			if(!fields){
				return response.json(filmRequest.data)
			}

			let arrayFilter = fields.split(",")	

			const validFilters = arrayFilter.filter(field=>{
				if(typeof filmRequest.data[field] === "object" || filmRequest.data[field]!==undefined){
					return true
				}
			})

			console.log(validFilters)

			await Promise.all(validFilters.map(async enrichFields=> {


				const itemRequest = await Promise.all(
					filmRequest.data[enrichFields].map(async item=>{
						 return axios.get(item)
					})
				); 

				const itemsArray = (itemRequest.map(filter=> {
					return filter.data
				}))
				filmRequest.data[enrichFields] = itemsArray
			}))
			return response.json(filmRequest.data)
		}
		catch(err){
			console.log(err)
		}

	}
}


module.exports = Controller