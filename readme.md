# flake

Flake is a daemon to mimic your yet-to-be-built or wired in backup daemon. It takes a markdown file full of route and request info and returns responses based off that. In fact, this very file is a valid Flake definitions file! So let's define some stuff.

#### What this does:
![What we're making](http://puu.sh/8RWIV/315721740f.png)

### Get the info on `GET /api/info`!

To start a "section", create a title with pound signs. In that title, have a string in the format `ACTION PATH` (including the backticks). Everything else in the title is ignored. And, of course, any content in the readme (such as this content!) will be ignored.

```json
{
    "author": "Connor Peet",
    "package": "flake"
}
```

We just defined a response! Now, whenever you send a GET request to `/api/info`, that JSON up there can be returned. It doesn't have to be JSON, of course, it can be anything you'd like.

### Let's make another route `POST /api/cookies`

You can also define specific requests and responses to those requests by creating a title called "request" or "response". For example, this route will only respond to:

#### Request

```json
{
    "type": "Macadamia Nut",
    "to": "connor4312"
}
```

#### Response

You can make your own response. Note that you can define a route multiple times with multiple different requests and responses!

```
Your cookie delivery is on the way!
```