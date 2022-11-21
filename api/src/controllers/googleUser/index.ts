import {GoogleUser} from '../../models/googleUser';
import {googleUser} from '../../Types';

export const addNewGoogleUser = async ({name, email, googleId, birthday, isAdmin}:googleUser) => {

	const googleUserFind = await GoogleUser.findOne({email: email});
	if(!name || !email || !googleId) {
		return new Error('incomplete information');
	}
	if(googleUserFind){
		console.log("este es el error");
		return new Error('user already exists');
	}
	else {
		const result = await GoogleUser.create({name, email, googleId});
		return result;
	}
};

export const getGoogleUserById = async (id:string) => {

	const result = await GoogleUser.findOne({googleId: id});
	return result;

};

export const getGoogleUserByEmail = async (email:string) => {

	const result = await GoogleUser.findOne({email: email});
	return result;

};


export const getAllGoogleUsers = async () => {
	const result = await GoogleUser.find();
	return result;	
}