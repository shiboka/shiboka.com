require "net/http"
require "rexml/document"
require "stringio"
require "uri"
require "erb"

def list_files_in_bucket(bucket_name, folder_name)
  uri = URI("https://storage.googleapis.com/#{bucket_name}")

  response = Net::HTTP.get(uri)
  doc = REXML::Document.new(response)

  files = []
  doc.elements.each("ListBucketResult/Contents/Key") do |element|
    file_name = element.text
    if file_name.start_with?(folder_name)
      files << file_name.gsub("#{folder_name}/", "")
    end
  end

  files
end

def fetch_file_from_bucket(bucket_name, path, file_name)
  encoded_file_name = ERB::Util.url_encode(file_name)
  uri = URI("https://storage.googleapis.com/#{bucket_name}/#{path}/#{encoded_file_name}")

  Net::HTTP.start(uri.host, uri.port, :use_ssl => uri.scheme == "https") do |http|
    request = Net::HTTP::Get.new uri
    request["Range"] = "bytes=0-1034"

    response = http.request request
    StringIO.new(response.body)
  end
end