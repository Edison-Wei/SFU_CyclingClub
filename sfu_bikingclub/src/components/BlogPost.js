export default function BlogPost() {
    return (
      <div>
        <div className="item-3 place-items-start">
            {/* Change this to lead to more information about the post, comments etc */}
          <a
            href="https://design.tutsplus.com/articles/envato-tuts-community-challenge-created-by-you-july-edition--cms-26724"
            className="card"
            >
            <div
              className="thumb"
              style={{ backgroundImage: 'url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/210284/flex-5.jpg)' }}>
            </div>
            <article>
              <h1 
                className="font-bold">Created by You, July Edition</h1>
              <p>Welcome to our monthly feature of fantastic tutorial results created by you, the Envato Tuts+ community!</p>
              <span>Melody Nieves</span>
            </article>
          </a>
        </div>
      </div>
    );
  }
  