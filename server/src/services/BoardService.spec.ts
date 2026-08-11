import { BoardRepository } from '../db/repositories/BoardRepository'
import { NotFoundError, ValidationError } from '../errors/domain-errors'
import { BoardService } from './BoardService'

function mockBoardRepo(): jest.Mocked<BoardRepository> {
  return {
    create: jest.fn(),
    findById: jest.fn(),
    findByOrganization: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<BoardRepository>
}

describe('BoardService', () => {
  it('createBoard() rejects an empty name without touching the repo', async () => {
    const boardRepo = mockBoardRepo()
    const service = new BoardService(boardRepo)

    await expect(service.createBoard({ organizationId: 'org1', name: '  ' })).rejects.toThrow(ValidationError)
    expect(boardRepo.create).not.toHaveBeenCalled()
  })

  it('createBoard() creates the board for a valid payload', async () => {
    const boardRepo = mockBoardRepo()
    boardRepo.create.mockResolvedValue({ id: 'b1', name: 'Assembly Line 1' } as never)
    const service = new BoardService(boardRepo)

    const board = await service.createBoard({ organizationId: 'org1', name: 'Assembly Line 1' })

    expect(board.id).toBe('b1')
  })

  it('getBoardById() throws NotFoundError when missing', async () => {
    const boardRepo = mockBoardRepo()
    boardRepo.findById.mockResolvedValue(null)
    const service = new BoardService(boardRepo)

    await expect(service.getBoardById('missing')).rejects.toThrow(NotFoundError)
  })

  it('updateBoard() throws NotFoundError when the board does not exist', async () => {
    const boardRepo = mockBoardRepo()
    boardRepo.findById.mockResolvedValue(null)
    const service = new BoardService(boardRepo)

    await expect(service.updateBoard('missing', { name: 'X' })).rejects.toThrow(NotFoundError)
    expect(boardRepo.update).not.toHaveBeenCalled()
  })

  it('updateBoard() updates when the board exists', async () => {
    const boardRepo = mockBoardRepo()
    boardRepo.findById.mockResolvedValue({ id: 'b1', name: 'Old' } as never)
    boardRepo.update.mockResolvedValue({ id: 'b1', name: 'New' } as never)
    const service = new BoardService(boardRepo)

    const updated = await service.updateBoard('b1', { name: 'New' })

    expect(updated.name).toBe('New')
  })
})
