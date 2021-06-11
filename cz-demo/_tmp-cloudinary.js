cloudinary.uploader.upload("sample.jpg", {"crop":"limit","tags":"samples","width":3000,"height":2000}, function(result) { console.log(result) });

cloudinary.image("sample", {"crop":"fill","gravity":"faces","width":300,"height":200,"format":"jpg"});

var cred = {
    cloudname: "htcif1pyx",
    api_key: "198615939156871",
    api_secret: "EyhTcLFCEI0if7iipgXKT7iLKg8",
    environment_variable: "cloudinary://198615939156871:EyhTcLFCEI0if7iipgXKT7iLKg8@htcif1pyx",
    preset_name: "sdyuzgm5"
}