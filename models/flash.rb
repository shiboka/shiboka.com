require "zlib"

class Flash
  def initialize(file)
    @data = read(file)
    @byte_idx = 0
    @bit_idx = 0
  end

  def dimensions
    return nil if @data.nil?

    n_bits = u_bits(5)
    puts n_bits

    s_bits(n_bits)
    w = s_bits(n_bits) / 20

    s_bits(n_bits)
    h = s_bits(n_bits) / 20

    @bit_idx = 0
    @byte_idx = 0

    { w:, h: }
  end

  private

  def read(file)
    return nil unless File.file?(file)

    data = File.read(file)
    header = data[0..2]

    if header == "FWS"
      return data[8..].unpack("c*")
    elsif header == "CWS"
      uncompressed = Zlib::Inflate.inflate(data[8..])
      return uncompressed.unpack("c*")
    end

    nil
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

    bit_count -= 1
    while bit_count >= 0
      value = value << 1 | bit
      bit_count -= 1
    end

    value
  end

  def s_bits(bit_count)
    value = bit.zero? ? 0 : -1
    bit_count -= 1

    bit_count -= 1
    while bit_count >= 0
      value = value << 1 | bit
      bit_count -= 1
    end

    value
  end
end
