# madgrades.com

The source for madgrades.com, a web interface for visualizing the data provided by the [Madgrades API](https://api.madgrades.com) \[[source](https://github.com/thekeenant/api.madgrades.com)\]. Get it yourself, or visit the official website at [madgrades.com](https://madgrades.com)!

## Usage

**Requirements**:
* Node (npm)

1. Get the required dependencies, `npm install`.
2. Get a Madgrades API token from [api.madgrades.com](https://api.madgrades.com).
3. Create a `.env.development` file with the line:

      ```
      REACT_APP_MADGRADES_API_TOKEN=<your api token>
      ```
      
4. Run the development server with `npm start`

Create a production-ready app with `npm run build`. Instead of a `.env.development` file, you will need `.env.production` with the same contents, assuming you are using the same key for production and development.


## Example Page

This is a course page:

![Madgrades Picture](https://i.imgur.com/sastR8g.png)
