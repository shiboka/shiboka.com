threads 1, 1
workers 0

preload_app!

port 3000
environment "development"

on_worker_boot do
  ActiveRecord::Base.establish_connection if defined?(ActiveRecord)
end
