# Use an official Ruby runtime as a parent image
FROM ruby:3.1.6-slim-bookworm

# Set the working directory in the container to /app
WORKDIR /app

# Add the current directory contents into the container at /app
ADD . /app

# Install dependencies
RUN apt update && apt install -y make gcc

# Install any needed packages specified in Gemfile
RUN bundle install

# Make sure Puma binds to the correct port
EXPOSE 80

# Set the default command
ENTRYPOINT ["puma", "-C", "config/puma_production.rb"]