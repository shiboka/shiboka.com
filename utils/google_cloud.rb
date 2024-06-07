require 'net/http'
require 'rexml/document'
require 'stringio'
require 'uri'

def list_files_in_bucket(bucket_name, folder_name)
  uri = URI("https://storage.googleapis.com/#{bucket_name}")

  response = Net::HTTP.get(uri)
  doc = REXML::Document.new(response)

  files = []
  doc.elements.each('ListBucketResult/Contents/Key') do |element|
    file_name = element.text
    if file_name.start_with?(folder_name)
      files << file_name.gsub("#{folder_name}/", "")
    end
  end

  files
end

def fetch_file_from_bucket(bucket_name, file_name)
  uri = URI("https://storage.googleapis.com/#{bucket_name}/#{file_name}")
  response = Net::HTTP.get(uri)
  StringIO.new(response)
end