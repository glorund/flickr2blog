package blogposter;

import com.flickr4java.flickr.Flickr;
import com.flickr4java.flickr.FlickrException;
import com.flickr4java.flickr.REST;
import com.flickr4java.flickr.people.User;
import com.flickr4java.flickr.photos.Photo;
import com.flickr4java.flickr.photos.PhotoList;

public class Poster {
    
    private static String getUrl(Photo photo) {
        return "https://farm"+photo.getFarm()  + ".staticflickr.com/" + photo.getServer() + "/"+photo.getId()+"_"+photo.getSecret()+"_m.jpg";
    }
    
    public static void main(String [] args) throws FlickrException {
        String apiKey = "6999cfb48e503984938e6c9ab658b33f";
        String sharedSecret = "b2c6ca876435d80d";
        Flickr f = new Flickr(apiKey, sharedSecret, new REST());
        String username = "glorund";
        User user = f.getPeopleInterface().findByUsername(username);
        System.out.println(user.getRealName() + " " + user.getId());
        String userId = user.getId(); 
        PhotoList<Photo> photos = f.getPeopleInterface().getPublicPhotos(userId, 10, 2);
        for (Photo photo: photos) {
            System.out.println("<p>"+photo.getTitle()+"<img src=\""+getUrl(photo)+"\" alt=\""+photo.getTitle()+"\">"
                        );
        }
    }
}
