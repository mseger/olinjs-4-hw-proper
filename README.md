#olin.js #4 — homework

**Due Tuesday Feb 5 before class**

We're gonna make a shitty Twitter.

## Reading

### Sessions

A few classes ago, we showed you how to use a database. Now we're going to introduce the concept of sessions. A **session** is a data store that is unique to each user's web browser, but the information is only visible to the server. Think of it as giving each user a unique order number, and when they request a webpage, you can customize it to their liking&mdash;but if they lose their order number, that information is gone. Thus, it's generally only appropriate to store some kinds of data in a session, like what account the user is logged in as or temporary settings. Depending on the user's setup, the next time they close their browser the session may be cleared.

Let's compare the types of ways we can store information.

1. **Sessions.** A session is any temporary information about the person requesting a webpage. If a user logs in, you can add their username to their **session**. If they come back in a week and haven't cleared their cookies, they will still be logged in. If they clear their cookies, next time they go to your webpage, they start a new session.
1. **Database.** A database is for long-term data storage you never want deleted (unintentionally). You would store a user's username in a session, but store their name, date of birth, and dreams in a database. That way their information outlives them closing their browser window.

For completeness sake, let's consider other ways we can explore data:

1. **Cookies.** Cookies are strings of information you store on a user's computer. Unlike sessions, cookies are generally in plaintext, i.e. a user can go ahead and edit their cookies. Cookies would be useful to store a user's preferred font size, but not their username, lest someone evil go ahead and set `document.cookie = 'username=supersecretadmindad'`. Muy mal.
1. **Global variables.** You might hear them described as "bad" or "evil" but our only consideration is that global variables go away when your server resets. On Heroku, your server might reset as often as every 10 minutes! Don't expect global variables to last long.
1. **Files.** Though we haven't covered it yet, Node can read and write files on your computer. Heroku doesn't let you write files, however, so we are going to remain willfully ignorant for a while.

In order to enable sessions in Express you have to do the following

```js
app.configure(function(){
  ...
  app.use(express.cookieParser(process.env.SECRET || 'fake_secret'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});
```

Note that `app.router` MUST go after you set up sessions or else it won't work. Let's take a look at what's going on here
* [express.cookieParser](http://expressjs.com/api.html#cookieParser) is a middleware (glue code). We're not storing the userID that is logged in on our cookies (at least not in plaintext). We're encrypting it with a secret key that we're passing along. The client will use this cookie so that our server can reference the proper session. Think of it as a key/value store where the encrypted cookie is our key and our session data is our value. If this is confusing, read [this on StackOverflow](http://stackoverflow.com/questions/5522020/how-do-sessions-work-in-express-with-nodejs).
* express.session is what actually tells express that we'll be using sessions

Or as a shortcut, you can tell Express to set up a new app with sessions pre-enabled

```
express --sessions
```

Alright, now that we've set up our session, we want to be able to store stuff in sessions (such as things about the logged in user). We can do this with `req.sessions`. So in pesudo code you want something like

```js
app.get('/login', function (req, res){
  user = new User
  user.save(function (){
    req.sessions.user = user;
  });
})
```

Now if the user goes to another page, we can just get the same user from our `req.session` variable. In pesudocode

```js
app.get('/mystuff', function(req, res){
  var user = req.sessions.user;
  // do stuff here
});
```

### The setInterval function

Let's imagine for a moment that we want a notice to show up on our website every second. Remember how we said that JS is async? This means that you can't just tell the process to pause for a second every time (well you can but this would be **bad** because then your app hangs for a second). 

However, you can use the `setInterval` function. Open up Chrome and paste this into your Chrome JS console

```
var alertMsg = function(){ alert('im cooool'); };
setInterval(alertMsg, 1000);
```

`setInterval` takes a function to execute as it's first parameter and the interval to execute it at (in ms) as it's second parameter. 

Check out [this article on javascript timing](http://www.w3schools.com/js/js_timing.asp) for more details on how `setInterval` works.

## Assignment
Paul and David are going to Twitter next year. Let's see just how easy it is to do their job.

* Fork this repo to your own account
* Generate an Express app
* `npm install` all the packages you think you'll need and add them to your `package.json` file
* Create an app that has the following routes
  
  * GET `/users/new` => shows a form that allows someone to input in a name for their user account. When they hit submit it should POST to `/users/new`. If a user with that name doesn't exist, it should create a new user, and  to `/`, with them logged in. If a user with that name exists, it should just log them in (with sessions), then redirect to '/'. 
  * GET `/` => shows a list of all the recent tweets. This page should use the javascript `setInterval` to poll for new tweets every 2 seconds. This means that new tweets should stream in without having to refresh the page. If a user is logged in it should also have a compose tweet box which allows that user to send tweets. When they hit the "tweet" button it should POST to `/tweets/:user` via an AJAX $.post call, if that post is successful, this tweet should also show up on their list of tweets without them refreshing the page. If that tweet fails (as in it's longer than 140 characters), an error message should be displayed to the user. 

  * Then do some funky CSS stuff so that the "/" page looks like the following (Don't use Twitter Bootstrap. That's cheating.)
  
  ![crappy twitter](https://github.com/olinjs/olinjs-4-hw/blob/master/annoted_crappy_twitter%20copy.png?raw=true)  

  Do your best to make the page look exactly like this. I know it's not beautiful, but the point is to practice precision css. One skill that you'll use often in industry is looking at a n image and turning that into css.The login page, however, can look however you want it to look.
  
* Create a Heroku `Procfile` like the one we made for you in previous homeworks
* Push to Heroku and add the url to the [homework sheet](https://docs.google.com/spreadsheet/ccc?key=0AjqGw-pw5UuudFhQSmJhZlRZWEhRTWcwYmxBVld6c1E#gid=3)
