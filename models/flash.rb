require "zlib"

class Flash
  def initialize(io)
    @data = read(io)
    @byte_idx = 0
    @bit_idx = 0
  end

  def dimensions
    return nil if @data.nil?

    n_bits = u_bits(5)

    s_bits(n_bits)
    w = s_bits(n_bits) / 20

    s_bits(n_bits)
    h = s_bits(n_bits) / 20

    @bit_idx = 0
    @byte_idx = 0

    { w:, h: }
  end

  private

  def read(io)
    header = io.read(3)
    io.seek(8)

    if header == "FWS"
      return read_first_chunk(io)
    elsif header == "CWS"
      return read_and_decompress_first_chunk(io)
    end

    nil
  end

  def read_first_chunk(io)
    chunk = io.read(1024)
    chunk&.unpack("c*")
  end

  def read_and_decompress_first_chunk(io)
    inflater = Zlib::Inflate.new
    begin
      compressed_chunk = io.read(1024)
      decompressed_chunk = inflater.inflate(compressed_chunk)
      decompressed_chunk.unpack("c*")
    ensure
      inflater.close
    end
  end

  def bit
    value = (@data[@byte_idx] >> (7 - @bit_idx)) & 0x01

    @bit_idx += 1
    if @bit_idx == 8
      @bit_idx = 0
      @byte_idx += 1
    end

    value
  end

  def u_bits(bit_count)
    value = 0

    bit_count.times do
      value = (value << 1) | bit
    end

    value
  end

  def s_bits(bit_count)
    value = bit.zero? ? 0 : -1

    (bit_count - 1).times do
      value = (value << 1) | bit
    end

    value
  end
end
