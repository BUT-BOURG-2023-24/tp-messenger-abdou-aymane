
import config from "../config";
import mongoose from 'mongoose';


class Database 
{
	fromTest: boolean;

	constructor(fromTest: boolean) 
	{
		this.fromTest = fromTest;
	}
	
	async connect()
	{
		if(this.fromTest){
			mongoose.connect(config.DB_ADDRESS_TEST).then(() => {
				console.log("DB TEST connected !");
			});
			
		}else{
			mongoose.connect(config.DB_ADDRESS).then(() => {
				console.log("DB connected !");
			  });
		}
		
	}
}

export default Database;
export type { Database };
