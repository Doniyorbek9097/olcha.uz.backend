module.exports = function nestedCategories(categories, parentId = null) {
    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == null || cat.parentId == undefined);
    } else {
        category = categories.filter(cat => String(cat.parentId) == String(parentId));
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            image: cate.image,
            left_banner: cate.left_banner,
            top_banner: cate.top_banner,
            icon: cate.icon,
            products: cate.products,
            parentId: cate.parentId,
            createdBy: cate.createdBy,
            createdAt: cate.createdAt,
            updatedAt: cate.updatedAt,
            children: nestedCategories(categories, cate._id)
        })
    }
    return categoryList;
}
