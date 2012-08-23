[![build status](https://secure.travis-ci.org/kilianc/node-ec2metadata.png)](http://travis-ci.org/kilianc/node-ec2metadata)
# node-ec2metadata ![project status](http://dl.dropbox.com/u/2208502/maintained.png)

An API wrapper for the AWS EC2 metadata: [aws userguide](http://docs.amazonwebservices.com/AWSEC2/latest/UserGuide/index.html?AESDG-chapter-instancedata.html)

## Installation with npm

    $ npm install ec2metadata

## A smart introduction to EC2 Metadata API

Amazon EC2 instances can access instance-specific metadata as well as data supplied when launching the instances. This data can be used to build more generic AMIs that can be modified by configuration files supplied at launch time.

For example, if you run web servers for various small businesses, they can all use the same AMI and retrieve their content from the Amazon S3 bucket you specify at launch. To add a new customer at any time, simply create a bucket for the customer, add their content, and launch your AMI.

Metadata is divided into categories. For a list of the categories, see Appendix B: [Metadata Categories](http://docs.amazonwebservices.com/AWSEC2/latest/UserGuide/index.html?instancedata-data-categories.html).

###Data Retrieval

An instance retrieves the data by querying a web server using a Query API. The base URI of all requests is http://169.254.169.254/latest/.

###Security of Launch Data

Although only your specific instance can access launch data, the data is not protected by cryptographic methods. You should take suitable precautions to protect sensitive data (such as long lived encryption keys).

__You are not billed for HTTP requests used to retrieve metadata and user-supplied data.__

###Metadata Retrieval

Requests for a specific metadata resource returns the appropriate value or a 404 HTTP error code if the resource is not available. All metadata is returned as text (content type text/plain).

Requests for a general metadata resource (i.e. an URI ending with a /) return a list of available resources or a 404 HTTP error code if there is no such resource. The list items are on separate lines terminated by line feeds (ASCII 10).

## Usage

```javascript
EC2Metadata.get([Array|String], Function);
```

The first parameter is an array of fields, the second one the complete callback.
EC2Metadata will request all the fields and call the callback at the and.
You can retrieve a complete list of fields skipping the first parameter of the get function.

```javascript
var EC2Metadata = require('ec2metadata');

EC2Metadata.get(function(err, data){
    console.log(JSON.stringify(data, null, '   '));
});
```

will output:

```javascript
[
   "amiid",
   "ami-launch-index",
   "ami-manifest-path",
   "block-device-mapping/",
   "hostname",
   "instance-action",
   "instance-id",
   "instance-type",
   "kernel-id",
   "local-hostname",
   "local-ipv4",
   "mac",
   "network/",
   "placement/",
   "public-hostname",
   "public-ipv4",
   "public-keys/",
   "reservation-id",
   "security-groups"
]
```

You can use each field as query, the callback data object will contains all the requested
fields with a camel case converted name.

```javascript
EC2Metadata.get(['public-hostname', 'local-ipv4', 'instance-id'], function(err, data){

    if(err){
        console.log('Something went wrong: ' + err.message);
        return;
    }

    console.log(data.publicHostname);
    console.log(data.localIpv4);
    console.log(data.instanceId);
});
```

A request the name of which does not end with a slash, will populate the data object with a string.
A request the name of which ends with a slash, will populate the data object with an Array.

## Tests

In order to run tests, you must deploy on a amazon ec2 instance and run `npm install`.

    $ npm test

## License

_This software is released under the MIT license cited below_.

    Copyright (c) 2010 Kilian Ciuffolo, me@nailik.org. All Rights Reserved.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the 'Software'), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:
    
    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.