require "sinatra"
require "sinatra/content_for"
require_relative "models/flash"

get "/" do
  erb :home, locals: { home_button: "active" }
end

get "/flash" do
  file = params[:f]

  unless file
    files = Dir.children("public/flash")
    files.select! { |i| i[/\.swf$/] }
    return erb :flash, locals: { flash_button: "active", files: }
  end

  flash = Flash.new("public/flash/#{file}")
  dims = flash.dimensions

  return "error\n200\n200" unless dims

  "#{file}\n#{dims[:w]}\n#{dims[:h]}"
end

get "/rrr" do
  files = Dir.children("public/rrr")
  files.select! { |i| i[/\.(png|jpg)$/] }
  erb :rrr, locals: { rrr_button: "active", files: }
end

get "/404" do
  halt 404
end

get "/flash/" do
  redirect "/flash"
end

get "/rrr/" do
  redirect "/rrr"
end

get "/404/" do
  redirect "/404"
end

error 400..499 do
  erb :error, locals: { status: }
end

error 404 do
  erb :e404, locals: { status: }
end

error 500..599 do
  "#{status} Server Error"
end
