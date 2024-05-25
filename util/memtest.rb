require "memory_profiler"
require_relative "models/flash"

report = MemoryProfiler.report do
  Flash.new("public/flash/pleaseunderstand.swf")
end

report.pretty_print
