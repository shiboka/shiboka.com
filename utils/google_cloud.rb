require "google/cloud/storage"

def list_files_in_bucket(bucket_name, folder_name)
  storage = Google::Cloud::Storage.new(
    project_id: "shiboka-com",
    credentials: "./key.json"
  )

  bucket = storage.bucket bucket_name
  files = bucket.files prefix: folder_name
  files.map { |file| file.name.gsub("#{folder_name}/", "") }
end

def fetch_file_from_bucket(bucket_name, file_name)
  storage = Google::Cloud::Storage.new(
    project_id: "shiboka-com",
    credentials: "./key.json"
  )

  bucket = storage.bucket bucket_name
  file = bucket.file file_name
end