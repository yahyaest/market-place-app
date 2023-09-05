import categoriesData from '../../static/data/categories.json';

export const getCategories = () => {
	const categorie = [];
	for (const category of categoriesData) {
		categorie.push(category.name);
	}
	return categorie;
};


export const getSubCategories = (category : string) => {
	return categoriesData.filter(e => e.name === category)[0].subcategories;
};
